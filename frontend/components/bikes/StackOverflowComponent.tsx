import { useState } from "react";
import { Dimensions, ScrollView, StyleSheet } from "react-native";
import { Card, List, Button, Surface } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";


const dimensions = Dimensions.get('window');
  
const style =  StyleSheet.create({
  containerScreen: {
    position: 'absolute',
    top: 1,
    left: 1,
    width: dimensions.width ,
    height: dimensions.height,
  },
  containerBody: {
    flex: 1,
    top: 5,
    left: 1,
    marginHorizontal: 16,
    marginBottom: 165,
    height: dimensions.height-225,
  },
  input: {
    margin: 4,
  },
  bottomButton: {
    position: 'absolute',
    top: dimensions.height-225,
    left: 16,
    right: 16,
  },
  text: {
    fontSize: 42,
  },
});

const PartsList = () => {
  const [sortOption, setSortOption] = useState('A-Z');
  const sortOptions = ["A-Z", "Due"].map(option => ({ label: option, value: option}));
  

  return (
    <Surface style={style.containerScreen}>
      <Card style={style.input}>
        <Card.Title title="Sort By:" right={() =>
          <Dropdown 
            value={sortOption}
            options={sortOptions}
            onSelect={(value) => setSortOption(value ? value : 'A-Z')}
            />      
        }/>
      </Card>
       
      <ScrollView  style={style.containerBody}>
        <List.Section>
          {data?.map(part => (
            <List.Accordion
              expanded={part.id === expandedBike}
              title={part.name}>
              {part.components.map(component => (
                <List.Item
                  title={component.name}
                  onPress={editComponent}
                />
              ))}
            </List.Accordion>
          ))}
        </List.Section>
      </ScrollView>
        
      <Button
        style={style.bottomButton} 
        mode="contained">
          Add  Item
      </Button>
    </Surface>
  );
};

#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>
#import <Expo/Expo.h>

@interface AppDelegate : EXAppDelegateWrapper <RNAppAuthAuthorizationFlowManager>

@property(nonatomic, weak)id<RNAppAuthAuthorizationFlowManagerDelegate>authorizationFlowManagerDelegate;

@end


#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>
#import "RNAppAuthAuthorizationFlowManager.h"
@interface AppDelegate : RCTAppDelegate<RNAppAuthAuthorizationFlowManager>

@property (nonatomic, weak) id<RNAppAuthAuthorizationFlowManagerDelegate> authorizationFlowManagerDelegate;

@end