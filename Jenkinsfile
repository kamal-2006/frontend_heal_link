pipeline {
    agent any

    tools {
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
                nodejs('NodeJS-22') {
                    sh 'npm install'
                }
            }
        }

        stage('3. Build Docker Image') {
            steps {
                echo "Building the Docker image..."
                // This command builds the image and tags it with the project name and build number
                sh "docker build -t nextjs-app:${env.BUILD_NUMBER} ."
            }
        }
        // ... other stages
    }
}