#!/bin/bash
fix_style () {
	npx standard --fix
}
verbose_style_errors () {
	npx standard -v
}
quiet_style_errors () {
	for line in $((npx standard -v) 2>&1)
	do
		let style_errors=style_errors+1
	done
	echo "There are $style_errors style errors in this file"
}
style_error_logging () {
	if [ "$1" = "--verbose" ]
	then
		verbose_style_errors
	elif [ "$1" = "--quiet" ]
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
	fi
	style_error_logging $flag
	if [ "$flag" = "--fix" ]
	then
		style_errors=0
		echo "Fixing style errors..."
		fix_style
	fi
done
}
build () {
	style_errors=0;
	cd client
	npm install
	process_flags $@
	npm test
	npm build run
	return $style_errors		
}
build $@
