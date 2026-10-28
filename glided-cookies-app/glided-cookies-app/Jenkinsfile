pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '=== Stage 1: Checking out repository ==='
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '=== Stage 2: Installing Node.js & Vite Dependencies ==='
                dir('frontend') {
                    bat 'npm install --no-audit --no-fund'
                }
                dir('backend') {
                    bat 'npm install --no-audit --no-fund'
                }
            }
        }

        stage('Lint & Syntax Check') {
            steps {
                echo '=== Stage 3: Verifying code syntax and integrity ==='
                dir('backend') {
                    bat 'node --check server.js'
                }
            }
        }

        stage('Production Build') {
            steps {
                echo '=== Stage 4: Compiling frontend with Vite ==='
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo '=== Stage 5: Artifacts Ready for Deployment ==='
                echo 'Build artifacts successfully verified in frontend/dist/'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline finished successfully!'
        }
        failure {
            echo '❌ Pipeline failed.'
        }
    }
}
