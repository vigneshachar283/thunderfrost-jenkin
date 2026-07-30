pipeline {
    agent any

    stages {

        stage('Clone') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/VijetKing/simple-devops-project.git'
            }
        }

        stage('Generate Report') {
            steps {
                sh './generate_report.sh'
            }
        }

        stage('Display Report') {
            steps {
                sh 'cat report.txt'
            }
        }
    }
}
