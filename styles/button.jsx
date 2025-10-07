import { StyleSheet, useColorScheme } from "react-native";

const getButtonStyles = (pressed) => {
    const colorScheme = useColorScheme();
    const buttonColor = colorScheme === 'dark' ? '#00012eff' : '#0082beff';
    const buttonPressColor = colorScheme === 'dark' ? '#00001eff' : '#005f8cff';
    const buttonHoverColor = colorScheme === 'dark' ? '#000279ff' : '#006593ff';
    const textColor = colorScheme === 'dark' ? 'white' : 'white';
    return StyleSheet.create({

        onpress: {
            backgroundColor: buttonPressColor
        },
        offpress: {
            backgroundColor: buttonHoverColor
        },
        text: {
            color: textColor,
            fontSize: 16,
            fontWeight: 'bold',
        },
        active: {
            borderWidth: 2,
            borderColor: "#0077c7ff", 
        },
        backgroundColor: buttonColor,
        alignItems: 'center',
        padding: 10,
        margin: 10,
        borderRadius: 5,

    })
}

export default getButtonStyles;