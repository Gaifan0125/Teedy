pipeline {
  agent any
  environment {
    DEPLOYMENT_NAME = "hello-node"
    CONTAINER_NAME = "teedy2025-manual-bp4nx"
    IMAGE_NAME = "teedy2025_manual:v1"
  }
  stages {
    stage('Start Minikube') {
      steps {
        sh '''
          if ! minikube status | grep -q "Running"; then
            echo "Starting Minikube..."
            minikube start
          else
            echo "Minikube already running."
          fi
        '''
      }
    }
    stage('Set Image') {
      steps {
        sh '''
          echo "Setting image for deployment..."
          kubectl set image deployment/${DEPLOYMENT_NAME} ${CONTAINER_NAME}=${IMAGE_NAME}
        '''
      }
    }
    stage('Verify') {
      steps {
        sh 'kubectl rollout status deployment/${DEPLOYMENT_NAME}'
        sh 'kubectl get pods'
      }
    }
  }
}
