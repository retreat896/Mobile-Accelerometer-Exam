import { StyleSheet, useColorScheme } from "react-native";


const getMainStyles = () => {
    //Use Colors based on light or dark mode
    const colorScheme = useColorScheme();
    const textColor = colorScheme === 'dark' ? 'white' : 'black';
    const backgroundColor = colorScheme === 'dark' ? '#2e2e2eff' : 'white';



    return StyleSheet.create({
        screen: {
            backgroundColor: backgroundColor,
        },
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        text: {
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'system-ui',
            color: textColor,
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
        }
    });
}

export default getMainStyles;
