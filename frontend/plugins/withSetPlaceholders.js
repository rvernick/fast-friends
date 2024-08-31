const { withAppBuildGradle } = require("@expo/config-plugins")

module.exports = function withSetPlaceholders(config) {

  return withAppBuildGradle(config, async config => {
    console.log("Adding redirect scheme to gradle.build + " + JSON.stringify(config));

    const initialIndex = config.modResults.contents.indexOf("defaultConfig {");
    const continueIndex = initialIndex + "defaultConfig {".length;

    console.log("index: " + initialIndex + ' continueIndex: ' + continueIndex);
    if (initialIndex === -1) {  // append a defaultConfig section
      config.modResults.contents = config.modResults.contents + 
      `defaultConfig {\n// place correct redirect scheme~
        manifestPlaceholders = [appAuthRedirectScheme: 'biz.fastfriends']\n
      }`;
    } else {
      // Add the billing dependency
      config.modResults.contents =
        config.modResults.contents.slice(0, continueIndex) + 
        `\n// placed appAuthRedirectScheme placeholder for AndroidManifest.xml
      manifestPlaceholders = [appAuthRedirectScheme: 'biz.fastfriends']\n` +
        config.modResults.contents.slice(continueIndex);
      }
    return config;
  })

  // return withAndroidManifest(config, async config => {
  //   let androidManifest = config.modResults.manifest

  //   androidManifest["data"]
    
  //   // add remove property to the audio record permission
  //   androidManifest["uses-permission"] = androidManifest["uses-permission"].map(
  //     perm => {
  //       if (perm.$["android:name"] === "android.permission.RECORD_AUDIO") {
  //         perm.$["tools:node"] = "remove"
  //       }
  //       return perm
  //     }
  //   )

  //   return config
  // })
}