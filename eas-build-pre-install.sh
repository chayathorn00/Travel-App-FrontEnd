#!/bin/bash
# Use Java 17
echo "Switching to Java 17"
export JAVA_HOME="/opt/hostedtoolcache/jdk/17.0.8/x64"
export PATH="$JAVA_HOME/bin:$PATH"
java -version
