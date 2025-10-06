import { Pressable, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import getMainStyles from '../styles/main'
import getButtonStyles from '../styles/button'
import LinkButton from '../modules/linkButton'

const Gravity = () => {
    const styles = getMainStyles();
    const button = getButtonStyles();
    return (
        <SafeAreaProvider style={styles.screen}>
            <SafeAreaView>
                <View>
                    <Text style={styles.text}>Gravity</Text>
                </View>
                <Text style={styles.text}>Hello, World!</Text>
                <LinkButton title="Water" link="/water"/>
                <LinkButton title="Home" link="/"/>
                <LinkButton title="Gravity" link="/gravity" active="true"/>
            </SafeAreaView>
        </SafeAreaProvider>

    )
}

export default Gravity;