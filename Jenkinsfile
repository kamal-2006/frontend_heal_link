pipeline {
    agent any

    stages {
        stage('1. Clone') {
            steps {
                // Jenkins automatically clones the code when using 'Pipeline from SCM'
                // This step just confirms and prints a message.
                echo 'Code successfully cloned from GitHub.'
            }
        }
        stage('2. Test') {
            steps {
                echo 'Skipping test stage for now.'
            }
        }
        stage('3. Build') {
            steps {
                echo 'Skipping build stage for now.'
            }
        }
        stage('4. Push to ECR') {
            steps {
                echo 'Skipping ECR push stage for now.'
            }
        }
        stage('5. Deploy to ECS') {
            steps {
                echo 'Skipping ECS deployment stage for now.'
            }
        }
    }
}