import React, { ReactElement, useState } from 'react';
import { Text, View, Dimensions, Animated, PanResponder } from 'react-native';

interface SlidableProps{
    leftTitle?: ReactElement | string,
    rightTitle?: ReactElement | string,
    children: ReactElement | string,
    leftColor?: string,
    rightColor?: string,
    onLeftAction?: () => void,
    onRightAction?: () => void
}

const WIDTH = Dimensions.get("screen").width;
const threshold = 0.5 * WIDTH;

const Slidable = (props:SlidableProps) =>
{

    const [scroll] = useState(new Animated.Value(0));

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
            if (dx > threshold)
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
            }else if (dx < -threshold){
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

    return (
        <Animated.View {...touch.panHandlers}
        style={{
            width: WIDTH*3,
            left: -1*WIDTH,
            height: 'auto',
            flexDirection: 'row',
            transform: [{translateX: scroll}]
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