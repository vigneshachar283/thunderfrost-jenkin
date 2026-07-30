pipeline {
    agent any

    environment {
        IMAGE_NAME = "thunderfrost"
        CONTAINER_NAME = "thunderfrost-app"
        PORT = "8081"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Project') {
            steps {
                sh '''
                test -f Dockerfile
                test -f index.html
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t $IMAGE_NAME .
                '''
            }
        }

        stage('Remove Old Container') {
            steps {
                sh '''
                docker rm -f $CONTAINER_NAME || true
                '''
            }
        }

        stage('Run Docker Container') {
            steps {
                sh '''
                docker run -d --name $CONTAINER_NAME -p $PORT:80 $IMAGE_NAME
                '''
            }
        }

        stage('Show URL') {
            steps {
                script {
                    def ip = sh(
                        script: "hostname -I | awk '{print \$1}'",
                        returnStdout: true
                    ).trim()

                    echo "=================================="
                    echo "Thunderfrost deployed successfully!"
                    echo "Application URL: http://${ip}:${PORT}"
                    echo "=================================="
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline Finished"
        }
    }
}
