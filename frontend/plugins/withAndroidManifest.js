const { withAndroidManifest, withProjectBuildGradle, createRunOncePlugin } = require('@expo/config-plugins');

const APP_AUTH_REDIRECT_SCHEME_PLACEHOLDER = 'appAuthRedirectScheme';

const withAppAuthRedirectScheme = (config) => {
  // Update AndroidManifest.xml
  config = withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;

    // Find and update the appAuthRedirectScheme placeholder in the AndroidManifest.xml
    if (androidManifest.manifest && androidManifest.manifest.application) {
      const application = androidManifest.manifest.application[0];
      if (application.activity) {
        application.activity.forEach((activity) => {
          if (activity['intent-filter']) {
            activity['intent-filter'].forEach((intentFilter) => {
              if (intentFilter.data) {
                intentFilter.data.forEach((data) => {
                  if (data.$['android:scheme']) {
                    data.$['android:scheme'] = `\${${APP_AUTH_REDIRECT_SCHEME_PLACEHOLDER}}`;
                  }
                });
              }
            });
          }
        });
      }
    }

    return config;
  });

  // Update project build.gradle to include the placeholder
  config = withProjectBuildGradle(config, (config) => {
    if (config.modResults.contents) {
      const buildGradle = config.modResults.contents;

      // Add the placeholder substitution in the android defaultConfig
      if (!buildGradle.includes(APP_AUTH_REDIRECT_SCHEME_PLACEHOLDER)) {
        const placeholderLine = `manifestPlaceholders = [${APP_AUTH_REDIRECT_SCHEME_PLACEHOLDER}: "biz.fastfriends"]`;
        config.modResults.contents = buildGradle.replace(
          /defaultConfig\s*\{/,
          `defaultConfig {\n        ${placeholderLine}`
        );
      }
    }

    return config;
  });

  return config;
};

const pkg = require('./package.json');
module.exports = createRunOncePlugin(withAppAuthRedirectScheme, pkg.name, pkg.version);
