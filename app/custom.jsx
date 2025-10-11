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

// The Balloon SVG files
const BalloonSVG = Asset.fromModule(require('../assets/Balloon.svg'));
const StringSVG = Asset.fromModule(require('../assets/Balloon_String.svg'));
const DartSVG = Asset.fromModule(require('../assets/Dart.svg'));

// Helper to load SVG file contents from a relative path
/**
 * Get SVG file contents from an Asset
 * @param {Asset} asset 
 */
async function GetSVG(asset) {
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
    Balloon = await GetSVG(BalloonSVG);
    String = await GetSVG(StringSVG);
    Dart = await GetSVG(DartSVG);
})();

/**
 * Function to render an SVG for the scene
 * @returns A SVG Object for rendering
 */
function RenderSVG(svgData, color, opacity) {
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
function CreateBalloon() {
    // Get the SVG object
    const balloonSVG = RenderSVG(Balloon, 0xe02100, 1);

    balloonSVG.scale.set(0.002, -0.001, 0.002); // Scale appropriately
    balloonSVG.rotateY(90); // Rotate 90 degrees

    // Get the String SVG object
    const stringSVG = RenderSVG(String, 0x00000, 1);

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

    return balloon;
}

/**
 * Create a dart to display
 * @returns Dart 3D Object
 */
function CreateDart() {

    // Get the SVG object
    const dartSVG = RenderSVG(Dart, 0x444444, 1);

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
    const animationFrameIdRef = useRef(null);
    const threeRefs = useRef({ renderer: null, scene: null, camera: null });
    const { width, height } = Dimensions.get('window');
    // Object queue to manage balloons
    const balloonQueue = [];

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

        const dart = CreateDart();
        
        scene.add(dart);
        dartRef.current = dart;

        let balloon = CreateBalloon();
        balloon.position.set(0, 0, 0); // Position to the right of the dart
        
        scene.add(balloon);
        balloonQueue.push(balloon);

        

        threeRefs.current = { renderer, scene, camera };

        const renderLoop = () => {
            const { renderer, scene, camera } = threeRefs.current;

            const dart = dartRef.current;
            const a = aRef.current;
            const p = physicsRef.current;
            const vFOV = 75 * (Math.PI / 180);
            const viewHeight = 2 * camera.position.z * Math.tan(vFOV / 2);
            const aspectRatio = width / height;
            const viewWidth = viewHeight * aspectRatio;
            const boundX = (viewWidth / 2) - 0.5;
            const boundY = (viewHeight / 2) - 0.5;

            if (renderer && scene && camera && dart) {
                // Manage the Balloon Queue
                for (let balloon of balloonQueue) {
                    let scale = balloon.scale;

                    // Make the balloon gently float up and down
                    balloon.position.y = Math.sin(Date.now() * 0.001) * 0.1;

                    // The balloon has been popped
                    if (balloon.popped) {
                        // It's been fully shrunk
                        if (scale.x <= 0 || scale.y <= 0) {
                            // Delete the balloon from the scene and the queue
                            scene.remove(balloon);
                            balloonQueue.splice(balloonQueue.indexOf(balloon));
                        }
                        // Continue shrinking the balloon
                        else {
                            // Shrink the balloon (Not sure if Z makes a difference, but leaving it all the same)
                            balloon.scale.set(scale.x - 0.01, scale.y - 0.01, scale.z - 0.01);
                        }
                    }

                    // Check for collision with dart
                    if (!balloon.popped && balloon.checkHeadCollision(dart)) {
                        console.log('Hit balloon head!');
                        console.log(scale);
                        // You can add pop animation or removal logic here
                        balloon.popped = true;
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

        renderLoop();
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