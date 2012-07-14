#!/bin/bash

# This script is used to build the XPI package
# ZIP utility is necessary for the functioning of this script
#
#
# Author : Nassim KACHA <nassim.kacha@blueicefield.com>

clear
find src/ -name ".*" -exec rm -f {} \;
find src/ -name "*~" -exec rm -f {} \;
#sed s/[0-9]*\\.[0-9]*\\.\\\([0-9]*\\\)/\\\1/g src/install.rdf 
cd src && find . | zip ../scanmail.xpi -@
if [ $? -eq 0 ]; then
   echo -e "\033[32m>>> XPI package build successful.\033[0m"
else
   echo -e "\033[31m>>> XPI package build failed.\033[0m"
fi

