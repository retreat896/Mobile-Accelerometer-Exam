import { Pressable, Text, View, Image } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import getMainStyles from '../styles/main'
import getButtonStyles from '../styles/button'
import LinkButton from '../modules/linkButton'

const Index = () => {
    const styles = getMainStyles();
    const button = getButtonStyles();
    return (
        <SafeAreaProvider style={styles.screen}>
            <SafeAreaView>
                <LinkButton title="Water" link="/water" />
                <LinkButton title="Home" link="/" active="true" />
                <LinkButton title="Gravity" link="/gravity" />
                <View style={styles.flexColumn}>
                    <Text style={styles.text}>CS3720 Mobile Applications Development</Text>
                    <View style={styles.flexColumn}>
                        <Text style={styles.text}>UW Platteville </Text>
                        <Image style={styles.image} source={{uri: "https://cdn.uwplatt.edu/logo/vertical/official/b_clear/1024.png"}}/>
                    </View>
                    <Text style={styles.text}>Kristopher Adams</Text>
                    <Text style={styles.text}>Professor: Dr. Abraham Aldaco</Text>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>

    )
}

export default Index