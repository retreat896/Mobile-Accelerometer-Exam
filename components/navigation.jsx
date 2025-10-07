import { View, Text } from 'react-native'
import React from 'react'
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
    let navigate= [];
    for (let link of links) {
        navigate.push(<LinkButton title={link.title} link={link.url} active={(link.name==active) ? "true": "false"}/>)
        //console.log(link,isActive)
    }

    return (
        <View>
           {navigate}
        </View>
    )
}

export default Navigation