pipeline {
  agent any
  stages {
    stage('Install') { steps { bat 'npm install' } }
    stage('Test') { steps { bat 'npm test' } }
    stage('Build Docker image') { steps { bat 'docker build -t eshop .' } }
  }
}
