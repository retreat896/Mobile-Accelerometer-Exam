import { Text, Component, Pressable } from 'react-native'
import { useRouter } from 'expo-router';
import getButtonStyles from '../styles/button';
import { Link } from 'expo-router';


const LinkButton = ({ onPress, title, link, active }) => {
    const router = useRouter();
    const button = getButtonStyles();
    const activeState = active === "true" ? true : false;
    return (
        <Pressable
            onPress={() => {
                // onPress && onPress();
                router.push(link);
            }}
            style={({ pressed }) => [
                activeState ? [button.active, button] : button,
                pressed ? button.onpress : button.offpress,
            ]}>

            <Text style={button.text}>{title}</Text>

        </Pressable>
    )
}


export default LinkButton;
