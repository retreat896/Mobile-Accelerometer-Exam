import { useRef, useCallback } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions, View } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, THREE } from 'expo-three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { useFocusEffect } from '@react-navigation/native';
import getMainStyles from '../styles/main';
import useAccelerometer from '../modules/accelerometer';
import Navigation from '../components/navigation';
import { File, Paths } from 'expo-file-system';
import { Asset } from 'expo-asset';

global.THREE = global.THREE || THREE;

// Game Settings
const BalloonTimer = 400; // Milliseconds
const TimerVariation = 100; // +/- Random() * TimerVariation added to timer
const MaxBalloons = 9; // Most Balloons being processed at once
const BaseVelocity = 0.03; // The base flight velocity of all balloons 

// Balloon types, speed, value
const BalloonColor = [0xe02100, 0xffe000, 0x21e000, 0x0066e0]; // red, yellow, green, blue
const BalloonSpeed = [1, 1.75, 2.5, 3];
const BalloonValue = [1, 2,   3,    4];

// The Balloon SVG files
const BalloonSVG = Asset.fromModule(require('../assets/Balloon.svg'));
const StringSVG = Asset.fromModule(require('../assets/Balloon_String.svg'));
const DartSVG = Asset.fromModule(require('../assets/Dart.svg'));

// Helper to load SVG file contents from a relative path
/**
 * Get SVG file contents from an Asset
 * @param {Asset} asset 
 */
async function getSVG(asset) {
    // The Asset hasn't been downloaded yet
    if (!asset.downloaded) await asset.downloadAsync();

    // After downloading, return the file contents
    const file = new File({ uri: asset.localUri });
    const svgContent = await file.text();

    return svgContent;
};

// The static SVG assets
let Balloon, String, Dart = '';

// Load the SVG file contents
(async () => {
    Balloon = await getSVG(BalloonSVG);
    String = await getSVG(StringSVG);
    Dart = await getSVG(DartSVG);
})();

/**
 * Function to render an SVG for the scene
 * @returns A SVG Object for rendering
 */
function renderSVG(svgData, color, opacity) {
    if (!svgData) throw new Error("Missing SVG data");

    // Load SVG
    const Loader = new SVGLoader();
    const Paths = Loader.parse(svgData).paths;

    // Create the shapes for the Object, based on the SVG data
    const Shapes = [];
    Paths.forEach(path => {
      const pathShapes = path.toShapes(true);
      Shapes.push(...pathShapes);
    });

    // Create the Object's geometry
    const Geometry = new THREE.ShapeGeometry(Shapes[0]);
    Geometry.center();

    // The material to use
    const Material = new THREE.MeshBasicMaterial({
      color: color, // 0x000000, // black
      side: THREE.DoubleSide,
      transparent: true,
      opacity: opacity // 1,
    });

    // Return the Object assembled from the material and geometry data
    return(new THREE.Mesh(Geometry, Material));
}

/**
 * Create a Balloon to display
 * @returns Balloon 3D Object
 */
function createBalloon(color) {
    // Get the SVG object
    const balloonSVG = renderSVG(Balloon, color, 1);

    balloonSVG.scale.set(0.002, -0.001, 0.002); // Scale appropriately
    balloonSVG.rotateY(90); // Rotate 90 degrees

    // Get the String SVG object
    const stringSVG = renderSVG(String, 0x00000, 1);

    // Keep same scale as Balloon
    stringSVG.scale.set(0.002, -0.001, 0.002);

    // Format String position to be in-line with the balloon's end.
    // This is an approximation
    stringSVG.position.y -= 0.6;
    stringSVG.position.x += 0.095;

    // Make the Balloon a single group, to render as one
    const balloon = new THREE.Group();
    
    // Name the parts for identification
    balloonSVG.name = 'balloonHead';
    stringSVG.name = 'balloonString';
    
    // Add to the balloon group
    balloon.add(balloonSVG);
    balloon.add(stringSVG);

    // Whether the balloon has been popped
    balloon.popped = false;

    // Add method to check collision with balloon head only
    balloon.checkHeadCollision = (object) => {
        // Find the balloon head by name
        const balloonHead = balloon.children.find(child => child.name === 'balloonHead');
        if (!balloonHead) return false;

        // Create bounding boxes for both objects
        const headBox = new THREE.Box3().setFromObject(balloonHead);
        const objectBox = new THREE.Box3().setFromObject(object);

        // Check for collision
        return headBox.intersectsBox(objectBox);
    };

    // Get the height
    balloon.getHeight = () => {
        const box = new THREE.Box3().setFromObject(balloon);
        return box.max.y - box.min.y;
    }

    // Get the width
    balloon.getWidth = () => {
        const box = new THREE.Box3().setFromObject(balloon);
        return box.max.x - box.min.x;
    }

    return balloon;
}

/**
 * Create a dart to display
 * @returns Dart 3D Object
 */
function createDart() {

    // Get the SVG object
    const dartSVG = renderSVG(Dart, 0x444444, 1);

    // Set the proper scale for the dart
    dartSVG.scale.set(0.005, -0.005, 0.005);

    return dartSVG;
}

const useThreeScene = (aRef) => {
    const physicsRef = useRef({
        velocityX: 0,
        velocityY: 0,
        DAMPING: 0.95,
        ACCEL_SENSITIVITY: 0.1,
    });

    const dartRef = useRef(null);
    const balloonQueueRef = useRef(null);
    const animationFrameIdRef = useRef(null);
    const threeRefs = useRef({ renderer: null, scene: null, camera: null });
    const { width, height } = Dimensions.get('window');

    const onContextCreate = useCallback(async (gl) => {
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            gl.drawingBufferWidth / gl.drawingBufferHeight,
            0.1,
            1000
        );
        camera.position.z = 5;

        const dart = createDart();
        scene.add(dart);
        dartRef.current = dart;

        // Object queue to manage balloons
        const balloonQueue = [];

        balloonQueueRef.current = balloonQueue

        threeRefs.current = { renderer, scene, camera };

        const vFOV = 75 * (Math.PI / 180);
        const viewHeight = 2 * camera.position.z * Math.tan(vFOV / 2);
        const aspectRatio = width / height;
        const viewWidth = viewHeight * aspectRatio;
        const boundX = (viewWidth / 2) - 0.5;
        const boundY = (viewHeight / 2) - 0.5;
        
        const renderLoop = () => {
            const { renderer, scene, camera } = threeRefs.current;
            
            const dart = dartRef.current;
            const a = aRef.current;
            const p = physicsRef.current;

            if (renderer && scene && camera && dart) {
                // Manage the Balloon Queue
                for (let balloon of balloonQueue) {
                    let position = balloon.position;
                    let scale = balloon.scale;

                    // It's been fully shrunk
                    if (position.y > (balloon.getHeight() + viewHeight) || (scale.x <= 0 || scale.y <= 0)) {
                        // Delete the balloon from the scene and the queue
                        scene.remove(balloon);
                        balloonQueue.splice(balloonQueue.indexOf(balloon), 1);

                        // Keep processing the remaining balloons
                        continue
                    }

                    // Make the balloon gently go with the "wind"
                    balloon.position.x += Math.abs(Math.cos(Date.now() * 0.001) * 0.01 * balloon.drift);

                    // The balloon has been popped
                    if (!balloon.popped) {
                        // Check for collision with dart
                        if (balloon.checkHeadCollision(dart)) {
                            console.log('Hit balloon head!');
                            
                            // You can add pop animation or removal logic here
                            balloon.popped = true;

                            // Keep processing the remaining balloons
                            continue;
                        }

                        // Increase the balloon's height
                        balloon.position.y += BaseVelocity * balloon.speed;
                    }
                    else {
                        // Shrink the balloon
                        balloon.scale.x, balloon.scale.y -= 0.05;
                    }
                }

                // Update velocity based on accelerometer
                p.velocityX += -a.x * p.ACCEL_SENSITIVITY;
                p.velocityY += -a.y * p.ACCEL_SENSITIVITY;

                // Apply damping
                p.velocityX *= p.DAMPING;
                p.velocityY *= p.DAMPING;

                // Update position
                dart.position.x += p.velocityX;
                dart.position.y += p.velocityY;

                // Calculate rotation angle based on velocity direction
                const angle = Math.atan2(p.velocityY, p.velocityX);
                dart.rotation.z = angle + Math.PI / 2; // Add PI/2 to invert the direction

                // Boundary checks with bounce effect
                if (dart.position.x > boundX) {
                    dart.position.x = boundX;
                    p.velocityX *= -0.5;
                } else if (dart.position.x < -boundX) {
                    dart.position.x = -boundX;
                    p.velocityX *= -0.5;
                }

                if (dart.position.y > boundY) {
                    dart.position.y = boundY;
                    p.velocityY *= -0.5;
                } else if (dart.position.y < -boundY) {
                    dart.position.y = -boundY;
                    p.velocityY *= -0.5;
                }

                renderer.render(scene, camera);
                gl.endFrameEXP();
            }
            animationFrameIdRef.current = requestAnimationFrame(renderLoop);
        };
        
        // Start the render loop before creating any Balloons
        renderLoop();
        
        // Generate Balloons using a timer for more variation in time
        let makeBalloons = true;
        const BalloonGenerator = () => {
            setTimeout(() => {
                // Don't make a new balloon
                if (MaxBalloons === balloonQueue.length) {
                    BalloonGenerator();
                    return;
                }

                // Determine the balloon type
                let type = Math.floor(BalloonColor.length * (Math.random() + Math.random())); // Balloon Type

                // Create the Balloon
                let balloon = createBalloon(BalloonColor[type]); 
                balloon.speed = BalloonSpeed[type]; // Balloon Speed
                balloon.drift = Math.random() * balloon.speed; // Balloon Drift
                balloon.value = BalloonValue[type]; // Balloon Value

                // Add the Balloon to the scene
                scene.add(balloon);
                // Add the Balloon to the queue
                balloonQueue.push(balloon);
                
                // Determine the x,y position of the balloon
                let x = (Math.random() >= 0.5 ? -1 : 1) * Math.random() * (viewWidth/2 - balloon.getWidth());
                let y = -1 * (viewHeight/2 + balloon.getHeight());

                // // Set the balloon's position
                balloon.position.set(x, y, 0);

                // Check if ballons should be made
                if (makeBalloons) {
                    // Continue Generating Balloons
                    BalloonGenerator();
                }
            }, BalloonTimer + TimerVariation * Math.random());
        }

        // Turn on the Balloon Generator
        BalloonGenerator();
    }, [aRef]);

    useFocusEffect(
        useCallback(() => {
            return () => {
                if (animationFrameIdRef.current) {
                    cancelAnimationFrame(animationFrameIdRef.current);
                    animationFrameIdRef.current = null;
                }
            };
        }, [])
    );

    return onContextCreate;
};

const Custom = () => {
    const styles = getMainStyles();
    const aRef = useAccelerometer();
    const onContextCreate = useThreeScene(aRef);

    return (
        <SafeAreaProvider style={styles.screen}>
            <SafeAreaView style={styles.screen}>
                <Navigation active="custom" />
                <GLView
                    style={styles.glView}
                    onContextCreate={onContextCreate}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Custom;