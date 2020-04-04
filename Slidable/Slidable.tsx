import React, { ReactElement, useState, useEffect } from 'react';
import { Text, View, Dimensions, Animated, PanResponder } from 'react-native';

interface SlidableProps{
    height: number,
    remove?: boolean,
    onRemove?: () => void,
    leftTitle?: ReactElement | string,
    rightTitle?: ReactElement | string,
    children: ReactElement | string,
    leftColor?: string,
    rightColor?: string,
    animateEntrance?: string,
    onLeftAction?: () => void,
    onRightAction?: () => void
}

const WIDTH = Dimensions.get("screen").width;
const threshold = 0.5 * WIDTH;

const Slidable = (props:SlidableProps) =>
{

    const entrance_direction = (props.animateEntrance === 'up') ? 1 : -1; 
    const [scroll] = useState(new Animated.Value(0));
    const [y_offset] = useState(new Animated.Value(props.height * entrance_direction));
    const [height] = useState(new Animated.Value(props.height));

    const touch = PanResponder.create({
        // Ask to be the responder:
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

        onShouldBlockNativeResponder: (evt, gestureState) => true,
        onPanResponderGrant: (evt, gestureState) => true,
        onPanResponderTerminationRequest: (evt, gestureState) => true,
        onPanResponderMove: (evt, {dx, moveX}) => {
            if (props.onLeftAction && dx > 0) scroll.setValue(dx);
            if (props.onRightAction && dx < 0) scroll.setValue(dx);
        },
        onPanResponderRelease: (evt, {dx}) => {
            if (dx > threshold && props.onLeftAction)
            {
                Animated.timing(scroll, {
                    toValue: WIDTH,
                    duration: 150,
                }).start(() =>
                {
                    if (dx > threshold && props.onLeftAction) props.onLeftAction();
                    Animated.timing(scroll, {
                        toValue: 0,
                        duration: 150,
                    }).start();
                })
            }else if (dx < -threshold && props.onRightAction){
                Animated.timing(scroll, {
                    toValue: -WIDTH,
                    duration: 150,
                }).start(() =>
                {
                    if (dx < -threshold && props.onRightAction) props.onRightAction();
                    Animated.timing(scroll, {
                        toValue: 0,
                        duration: 150,
                    }).start();
                })
            }else{
                Animated.timing(scroll, {
                    toValue: 0,
                    duration: 150,
                }).start();
            }
        }
      });

    useEffect(() =>
    {

        Animated.timing(y_offset,{
            toValue: 0,
            duration: 300
        }).start();

    },[]);

    if (props.remove)
    {
        Animated.timing(height,{
            toValue: 0,
            duration: 300
        }).start(props.onRemove);
    }

    return (
        <Animated.View {...touch.panHandlers}
        style={{
            width: WIDTH*3,
            left: -1*WIDTH,
            height: height,
            flexDirection: 'row',
            transform: [
                {translateX: (
                    props.remove ? height.interpolate(
                        {
                            inputRange: [0,props.height], 
                            outputRange: [1000,Dimensions.get("screen").width]
                        }) : scroll)},
                (props.animateEntrance ? {translateY: y_offset} : {translateY: 0})
            ]
        }}>
            <View style={{
                width: WIDTH,
                alignItems: 'flex-end',
                justifyContent: 'center',
                backgroundColor: props.leftColor || 'red',
                paddingRight: 10
            }}>
                {
                    (typeof props.leftTitle === 'string') ?
                    <Text>{props.leftTitle}</Text>
                    : (props.leftTitle ? props.leftTitle : undefined)
                }
            </View>
            <View style={{
                width: WIDTH,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {
                    typeof props.children === 'string' ?
                    <Text>{props.children}</Text> : props.children
                }
            </View>
            <View style={{
                width: WIDTH,
                alignItems: 'flex-start',
                justifyContent: 'center',
                backgroundColor: props.rightColor || 'green',
                paddingLeft: 10
            }}>
                {
                    (typeof props.rightTitle === 'string') ?
                    <Text>{props.rightTitle}</Text>
                    : (props.rightTitle ? props.rightTitle : undefined)
                }
            </View>
        </Animated.View>
    )
}

export default Slidable;