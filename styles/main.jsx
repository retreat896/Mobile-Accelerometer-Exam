import { StyleSheet, useColorScheme } from "react-native";


const getMainStyles = () => {
    //Use Colors based on light or dark mode
    const colorScheme = useColorScheme();
    const textColor = colorScheme === 'dark' ? 'white' : 'black';
    const backgroundColor = colorScheme === 'dark' ? '#2e2e2eff' : 'white';
    


    return StyleSheet.create({
        screen: {
            backgroundColor: backgroundColor,
            flex: 1,
        },
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        footer:{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            padding: 10,
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginBottom: 40,
        },
        text: {
            fontSize: 20,
            fontFamily: 'system-ui',
            color: textColor,
            green:{
                color: 'green'
            }
        },
        score:{
            alignContent: "center",
            justifyContent: "center",
            alignSelf:"center",
        },
        bold:{
            fontWeight: 'bold',
        },
        image:{
            width: 200,
            height: 200,
            resizeMode: 'contain',
            margin: 10,
        },
        flexRow: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            margin: 10,
        },
        flexColumn: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 10,
        },
        smallLogo: {
            width: 100,
            height: 100,
            resizeMode: 'contain',
            margin: 10,
        },
        /* For Gyroscope Display, from expo demo */
        buttonContainer: {
          flexDirection: 'row',
          alignItems: 'stretch',
          marginTop: 15,
        },
        button: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#eee',
          padding: 10,
        },
        middleButton: {
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: '#ccc',
        },
        glView: {
            flex: 1,
            //fill the screen with no margin and padding
            margin: 0,
            padding: 0,
            width: '100%',
            height: '108%',
            top: 0,
            left: 0,
            position: 'absolute',
            zIndex: -1,
            borderColor: 'red',
            borderWidth: 1,
        },
        backgroundImage:{
            width: '100%',
            height: '110%',
            top: 0,
            left: 0,
            position: 'absolute',
            zIndex: -2,
        }
    });
}

export default getMainStyles;
