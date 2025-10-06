import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import getMainStyles from '../styles/main'
import getButtonStyles from '../styles/button'
import LinkButton from '../components/linkButton'

const Geometry = () => {
    const styles = getMainStyles();
    const button = getButtonStyles();
    return (
        <SafeAreaProvider style={styles.screen}>
            <SafeAreaView>
                <LinkButton title="Geometry" link="/geometry" active="true" />
                <LinkButton title="Home" link="/" />
                <LinkButton title="Gravity" link="/gravity" />
                <LinkButton title="Custom" link="/custom" />
            </SafeAreaView>
        </SafeAreaProvider>

    )
}

export default Geometry