import { View, Text } from 'react-native'
import LinkButton from './linkButton';

const Navigation = ({active}) => {
    const links = [
        {
            name:"index",
            title: "Home",
            url: "/"
        },
        {
            name:"custom",
            title: "Custom",
            url: "/custom"
        },
        {
            name:"geometry",
            title: "Geometry",
            url: "/geometry"
        },
        {
            name:"gravity",
            title: "Gravity",
            url: "/gravity"
        }
    ];

    const navigate = links.map((link) => (
        <LinkButton
            key={link.name}
            title={link.title}
            link={link.url}
            active={active === link.name ? "true" : "false"}
        />
    ));

    return (
        <View>
           {navigate}
        </View>
    )
}

export default Navigation