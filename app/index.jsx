import { Text, View, Image } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import getMainStyles from '../styles/main'
import getButtonStyles from '../styles/button'
import LinkButton from '../components/linkButton'
import Navigation from '../components/navigation'

const Index = () => {
    const styles = getMainStyles();
    const button = getButtonStyles();
    return (
        <SafeAreaProvider style={styles.screen}>
            <SafeAreaView>
                <Navigation active="index"/>
                <View style={styles.flexColumn}>
                    <Text style={styles.text}>CS3720 Mobile Applications Development</Text>
                    <View style={styles.flexColumn}>
                        <Text style={styles.text}>UW Platteville </Text>
                        <Image style={styles.image} source={{uri: "https://cdn.uwplatt.edu/logo/vertical/official/b_clear/1024.png"}}/>
                    </View>
                    <Text style={styles.text}>Kristopher Adams | Jacob Malland</Text>
                    <Text style={styles.text}>Professor: Dr. Abraham Aldaco</Text>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>

    )
}

export default Index