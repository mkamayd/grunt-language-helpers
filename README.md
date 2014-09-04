# grunt-language-helpers

> 4 grunt task helpers for working with json base language dictionaries
> * langGenerate
> * langSort
> * langCheck
> * langDiff

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-language-helpers --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-language-helpers');
```

## The "langGenerate" task

### Overview
In your project's Gruntfile, add a section named `langGenerate` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
        langGenerate: {
            options:{
                source: 'languages/en.json',
                destiny: 'languages/test.json'
                /* optionals
                minify: false,
                useKeyAsValue: false,
                prefix: '[',
                suffix: ']',
                ,printInConsole:
                 {
                 source: true,
                 destiny: true
                 }
                */
            }
        }
});
```
This task is useful because allow you to automatically create 
```js
{
	"KEY_1": "[Translation 1]",
    "KEY_2": "[Translation 2]",
}
```
from model.json
```js
{
	"KEY_1": "Translation 1",
    "KEY_2": "Translation 2",
}
```
So you can see straight away the parts of your app that are already translated and how.

### Options

#### options.source
(Required)
Type: `String`
The source path to the json model language.

#### options.destiny
(Required)
Type: `String`
The destiny path to generated json language base on the source language.


#### options.minify
(Optional)
Type: `Boolean` 
Default value: `'false'`
If the generated json file will minified or pretty formatted.

#### options.prefix
(Optional)
Type: `String`
Default value: `'['`
Prefix of translation text.

#### options.suffix
(Optional)
Type: `String`
Default value: `']'`
Suffix of translation text.

#### options.printInConsole.source
(Optional)
Type: `Boolean`
Default value: `'false'`
Print out to the console the entire source json file.

#### options.printInConsole.destiny
(Optional)
Type: `Boolean`
Default value: `'false'`
Print out to the console the entire destiny json file.
### Usage Examples

Adding this task to your watch with live reload can be very useful.

## The "langSort" task

### Overview
In your project's Gruntfile, add a section named `langSort` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    langSort: {
          options: {
              langFolder: 'languages/',
              targets: ['en', 'es']
              //minify: false
          }
      }
});
```
This task is useful because allow you to automatically improve the readability of your language definition 
```js
{
	"KEY_Z": "Translation Z",
    "KEY_A": "Translation A",
}
```
become sorted
```js
{
	"KEY_A": "Translation A",
    "KEY_Z": "Translation Z",
}
```
So it is easier to find a key and improve human readability.

### Options

#### options.langFolder
(Required)
Type: `String`
The source path to the folder containing all the languages.

#### options.targets
(Required)
Type: `String Array`
The languages in that folder that you want to sort. file is expected to end in ".json".

#### options.minify
(Optional)
Type: `Boolean`
Default value: `'false'`
If the generated json will minified or pretty formatted.

## The "langCheck" task

### Overview
In your project's Gruntfile, add a section named `langCheck` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    langCheck: {
          options:{
              langFolder: 'languages/',
              targets: ['en', 'es']
          }
    }
});
```
Check if keys have the right format (A_KEY)
Check if the same value is used for different keys
Check for whitespace problems.
    * starting or ending with whitespace
    * multiple whitespaces together
    * empty values.
### To do
Add regular expressions capabilities
 
### Options

#### options.langFolder
(Required)
Type: `String`
The source path to the folder containing all the languages.

#### options.targets
(Required)
Type: `String Array`
The languages in that folder that you want to sort. files are expected to end in ".json".

## The "langDiff" task

### Overview
In your project's Gruntfile, add a section named `langDiff` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    langDiff: {
          options: {
              langFolder: 'languages/',
              model: 'en',
              targets: ['es']
          }
      }
});
```

Check for:
    * Missing keys in the target that are in the model.
    * Unexpected extra keys in the target that the model don't have.
 
### Options

#### options.langFolder
(Required)
Type: `String`
The source path to the folder containing all the languages.

#### options.model
(Required)
Type: `String`
The model language that you know is ok.

#### options.targets
(Required)
Type: `String Array`
The languages in that folder that you want to check against the model language. files are expected to end in ".json".

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
Please fell free to do pull request.

## Release History
version 1.
