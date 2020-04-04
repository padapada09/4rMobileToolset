import React, { useState, useEffect, FunctionComponent, ReactElement } from 'react';
import { Animated, View, StyleSheet, Text, TouchableOpacity,Dimensions, ScrollView, TextInput } from 'react-native';
import { PromptProps, PromptOptions } from './Types'; 

const Prompt : FunctionComponent<PromptProps> = (props : PromptProps) : ReactElement =>
{

    let options: PromptOptions;

    if (typeof props.options === 'string') 
    {
        options = {title: props.options, actions: [[{title: 'OK', value: 'OK'},{title: 'CANCEL', value: 'CANCEL'}]]};
    }else{
        options = props.options;
    }
    const [top] = useState(new Animated.Value(-Math.round(Dimensions.get('window').height)));
    const [input, setInput] = useState('');

    useEffect(() =>
    {
        Animated.timing(
            top,
            {
              toValue: 0,
              duration: 500,
            }
        ).start();
    },[]);

    const onSubmit = (value:string) =>
    {
        Animated.timing(
            top,
            {
              toValue: -Math.round(Dimensions.get('window').height),
              duration: 500,
            }
        ).start(() => props.onSubmit({value, input}));
    }

    //Check if there are styles given
    const card_style:Object|undefined = props.style ? props.style.card : undefined;
    const button_style:Object|undefined = props.style ? props.style.button : undefined;
    const actions_style:Object|undefined = props.style ? props.style.actions : undefined;
    const content_style:Object|undefined = props.style ? props.style.content : undefined;
    const text_style:Object|undefined = props.style ? props.style.text : undefined;
    const title_style:Object|undefined = props.style ? props.style.title : undefined;
    const input_style:Object|undefined = props.style ? props.style.input : undefined;
    
    const style = StyleSheet.create({
        card: {
            backgroundColor: '#ffffff',
            width: '90%',
            top: 15,
            left: '5%',
            borderRadius: 15,
            elevation: 10,
            ...card_style,
            position: 'absolute',
            alignItems: 'center'
        },
        actions: {
            ...actions_style,
            flexDirection: 'row',
            width: '100%',
            height: 40,
            margin: 5
        },
        button: {
            ...button_style,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        title: {
            width: '90%',
            paddingTop: 10,
            ...title_style,
        },
        content: {
            maxHeight: 200,
            paddingTop: 20,
            paddingBottom: 7,
            ...content_style,
            width: '90%'
        },
        text: {
            textAlign: 'center',
            fontSize: 15,
            ...text_style
        },
        input: {
            textAlignVertical: 'bottom',
            fontSize: 15,
            backgroundColor: 'white',
            width: '90%',
            margin: 0,
            marginBottom: 10,
            ...input_style
        }
    });

    return (
            
        <Animated.View style={{...style.card, transform: [{translateY: top}]}}>
            <View style={style.title}>
                <Text style={{...style.text, fontSize: (style.text.fontSize + 5)}}>
                    {options.title}
                </Text>
            </View>
            <ScrollView style={style.content}>
                <Text style={{...style.text, textAlign: 'justify'}}>
                    {options.content}
                </Text>
            </ScrollView>
            {
                options.input ?
                    <TextInput
                    underlineColorAndroid='black' 
                    style={style.input}
                    placeholder={(typeof options.input) === 'string' ? options.input.toString() : 'Input...'}
                    onChangeText={(new_input) => setInput(new_input)}/>
                : undefined
            }
            {
                options.actions.map((action_set,key) =>
                    <View key={key} style={style.actions}>
                    {
                        action_set.map((action,inner_key) => ( 
                            <TouchableOpacity
                            key={inner_key}
                            style={style.button}
                            onPress={() => onSubmit(action.value)}>
                                <Text style={style.text}>
                                    {action.title}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                    </View>
                )
            }
        </Animated.View>

    )
}

export default Prompt;