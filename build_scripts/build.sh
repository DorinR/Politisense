#!/bin/bash
style_errors=0
strict=0
verbose=0
fix_style () {
	npx standard --fix
}
verbose_style_errors () {
	style_errors=$(npx standard -v | wc -l)
	style_errors=$((style_errors-1))
	npx standard -v

}
quiet_style_errors () {
	style_errors=$(npx standard -v | wc -l)
	echo "There are: $style_errors style errors in this file"
}
style_error_logging () {
	if [ $verbose -eq 1 ]
	then
		verbose_style_errors
	elif [ $verbose -eq 0 ]
	then
		quiet_style_errors
	fi
}
process_flags () {

local flag_list=$@

if [ -z $1 ]
then
	flag_list=( "--quiet" )
fi
for flag in $flag_list
do
	if [ "$flag" = "--strict" ]
	then
		echo "Strict style rules enabled, build will fail by style errors"
		echo "excludes parsing errors from the linter"
		strict=1
	fi
	if [ "$flag" = "--fix" ]
	then
		echo "Fixing style errors..."
		fix_style
	fi
	if [ "$flag" = "--verbose" ]
	then
	  echo "verbose logging enabled"
	  verbose=1
	fi
done
	style_error_logging
if [ $style_errors -gt 0 ]
then
	return 1
fi
	return 0
}

run_tests () {
  valid="$(CI=true npm test -- --forceExit --coverage --no-watch | grep -c 'failed')"
  if [ $valid != 0 ]
  then
    return 1
  fi
  return 0
}

build () {
	cd client
	process_flags $@
	if [[ $style_errors != 0 && $strict -eq 1 ]]
	then
	  return 1
	fi
	npm install
	if run_tests
	then
	  return 1
	fi
	npm run build
}
build $@