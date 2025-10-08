import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import getMainStyles from '../styles/main'
import getButtonStyles from '../styles/button'
import Navigation from '../components/navigation'

const Gravity = () => {
    const styles = getMainStyles();
    const button = getButtonStyles();
    return (
        <SafeAreaProvider style={styles.screen}>
            <SafeAreaView>
                <Navigation active="gravity"/>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default Gravity;