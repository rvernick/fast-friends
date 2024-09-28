const { withInfoPlist } = require('expo/config-plugins');

/**
 * Custom plugin to add LSApplicationQueriesSchemes to Info.plist.
 * @param {ConfigPlugin.Config} config - Current project configuration.
 * @param {string} id - ID of the plugin.
 **/
module.exports = function withCustomConfig(config, id) {
  return withInfoPlist(config, config => {
    config.modResults.LSApplicationQueriesSchemes = ['strava'];
    return config;
  });
};


/**
 * Should add LSApplicationQueriesSchemes to Info.plist.
 * <key>LSApplicationQueriesSchemes</key>
    <array>
      <string>strava</string>
    </array>
 */