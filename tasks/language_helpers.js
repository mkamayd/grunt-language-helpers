/*
 * grunt-language-helpers
 * https://github.com/Miguel/grunt-language-helpers
 *
 * Copyright (c) 2014 Miguel Gutierrez Kamayd
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

    function multipleSpaces(str) {
            var i = 0, lastWasSpace = false;
            for (; i < str.length; i++) {
                if (str[i] === ' ') {
                    if (lastWasSpace) {
                        return true;
                    }
                    lastWasSpace = true;
                }
                else {
                    lastWasSpace = false;
                }
            }
        }
    function checkPresenceAndRemove(arr, obj) {
            var indexs = [], i = 0;
            for (; i < arr.length; i++) {
                if (arr[i] === obj) {
                    indexs.push(i);
                }
            }
            i = 0;
            for (; i < indexs.length; i++) {
                arr.splice(indexs[i] - i, 1);
            }
            return indexs.length;
        }
    function isKeyFormatted(str) {
            if (str.search(' ') !== -1) {
                return false;
            }
            if (str !== str.toUpperCase()) {
                return false;
            }
            return true;
        }

    grunt.registerTask('langGenerate','Generate a language dictionary for testing propose', function () {
        var options = this.options(
                {
                    minify: false,
                    useKeyAsValue: false,
                    prefix: '[',
                    suffix: ']',
                    printInConsole:
                    {
                        source: false,
                        destiny: false
                    }
                }
            ),
            space = options.minify ? null : '\t';
        grunt.verbose.ok('source : ' + options.source);
        grunt.verbose.ok('destiny : ' + options.destiny);
        grunt.verbose.ok('prefix : "' + options.prefix + '", Suffix : "' + options.suffix+'"');
        grunt.verbose.ok('useKeyAsValue : ' + (options.useKeyAsValue? 'true':'false'));
        grunt.verbose.ok('minify : '+ (options.minify? 'true':'false'));
        if (options.destiny && options.source && grunt.file.exists(options.source)) {
            var sourceJson = grunt.file.readJSON(options.source),
                key, value, destinyJson = {}, textCore;
            if (options.printInConsole.source) {
                grunt.log.writeln('The source language (' + options.source + ')');
            }
            for (key in sourceJson) {
                value = sourceJson[key];
                if (options.printInConsole.source) {
                    grunt.log.writeln(key + ':' + value);
                }
                textCore = (options.useKeyAsValue) ? key : value;
                destinyJson[key] = options.prefix + textCore + options.suffix;
            }
            grunt.file.write(options.destiny, JSON.stringify(destinyJson, null, space));
            if (options.printInConsole.destiny) {
                grunt.log.writeln('The destiny language (' + options.destiny + ')');
                for (key in destinyJson) {
                    value = destinyJson[key];
                    grunt.log.writeln(key + ':' + value);
                }
            }
        }
        else {
            grunt.log.error('Options "source" and "destiny" are required and must be valid.');
        }
        return !this.errorCount;
    });
    grunt.registerTask('langSort','useful for tiding up your language. It\'ll sort your values and improve the style',  function () {
        var options = this.options( { minify : false, targets:[] } ),
            space = options.minify ? null : '\t';

        function langSort(path) {
            var jsonLang = grunt.file.readJSON(path), key, theArray = [];
            for (key in jsonLang) {
                theArray.push(key);
            }
            theArray.sort();
            var jsonLangResult = {}, index;
            for (index in theArray) {
                key = theArray[index];
                jsonLangResult[key] = jsonLang[key];
            }
            grunt.file.write(path, JSON.stringify(jsonLangResult, null, space));
        }
        if(options.targets.length === 0)
        {
            grunt.log.warn('Empty targets languages array make no sense.');
        }
        if(options.langFolder)
        {
            var index;
            for (index in options.targets) {
                langSort(options.langFolder + options.targets[index] + '.json');
            }
        }
        else
        {
            grunt.log.error('Option "langFolder" is required');
        }

        return !this.errorCount;
    });

    /*                  langDiff                      */
    //      * Missing keys
    //      * Unexpected extra keys
    grunt.registerTask('langDiff','Check a model language against multiple targets', function () {
        function langDiff(path) {
            var key, keysTarget = [], occurrences,
                jsonTargetLang = grunt.file.readJSON(path);
            for (key in jsonTargetLang) {
                keysTarget.push(key);
            }
            //checking for missing keys
            var keysToRemove = keysTarget.slice(0);//coping the array
            for (key in jsonModelLang) {
                occurrences = checkPresenceAndRemove(keysToRemove, key);
                if (occurrences === 0) {
                    grunt.log.error('Missing key for translation => "' + key + '" : "' + jsonModelLang[key] + '",');
                }
            }
            //checking for extra keys
            keysToRemove = keysModel.slice(0);//coping the array
            for (key in jsonTargetLang) {
                occurrences = checkPresenceAndRemove(keysToRemove, key);
                if (occurrences === 0) {
                    grunt.log.error('Unexpected extra key with translation => "' + key + '" : "' + jsonTargetLang[key] + '",');
                }
            }
        }

        var options = this.options({targets: []}), index,
            keysModel = [], modelKey,
            jsonModelLang = grunt.file.readJSON(options.langFolder + options.model + '.json');
        for (modelKey in jsonModelLang) {
            keysModel.push(modelKey);
        }
        for (index in options.targets) {
            grunt.verbose.writeln('\tChecking differences. Model : "' + options.model + '" with Target "' + options.targets[index] + '"');
            langDiff(options.langFolder + options.targets[index] + '.json');
        }
        return !this.errorCount;

    });
    /*                  langCheck                      */
    //  check if keys have the right format (A_KEY)
    //  check if we are using same value for different keys
    //  check if we have whitespace problems.
    //      * starting or ending with whitespace
    //      * multiple whitespaces together
    //      * empty values.
    grunt.registerTask('langCheck', 'Check if the language dictionary is well formatted ', function () {
        function langCheck(path) {
            var jsonLang = grunt.file.readJSON(path),
                index, values = [], key, value, occurrences;
            for (key in jsonLang) {
                if (!isKeyFormatted(key)) {
                    grunt.log.error('The key : "' + key + '" has an invalid format.');
                }
                values.push(jsonLang[key]);
            }
            var valuesToRemove = values.slice(0);//coping the array
            for (index in values) {
                value = values[index];
                occurrences = checkPresenceAndRemove(valuesToRemove, value);
                if (occurrences >= 2) {
                    grunt.log.error('the value : "' + value + '" is duplicated. Near definition : ' + index);
                }
                else {
                    if (value.length > 0) {
                        if (value[0] === ' ') {
                            grunt.log.error('Starting with whitespace. Near definition : ' + index);
                        }
                        else if (value[value.length - 1] === ' ') {
                            grunt.log.error('Ending with whitespace. Near definition : ' + index);
                        }
                        else if (multipleSpaces(value)) {
                            grunt.log.error('Multiple whitespaces. Near definition : ' + index);
                        }
                    }
                    else {
                        grunt.log.error('A values is empty near definition : ' + index);
                    }

                }
            }
        }

        var options = this.options({targets:[]});

        var index;
        for (index in options.targets) {
            grunt.log.writeln('\tValidating language "' + options.targets[index] + '"');
            langCheck(options.langFolder + options.targets[index] + '.json');
        }
        return !this.errorCount;
    });
};
