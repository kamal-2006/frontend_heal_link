pipeline {
    agent any

    tools {
        // Use the new Node.js 22 configuration
        nodejs 'NodeJS-22'
    }

    stages {
        stage('1. Clone') {
            steps {
                echo 'Code successfully cloned from GitHub.'
            }
        }

        stage('2. Test') {
            steps {
                // Use the nodejs block to ensure commands run in the correct environment
                nodejs('NodeJS-22') {
                    echo 'Installing dependencies and running tests...'
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }
        // ... other stages
    }
}