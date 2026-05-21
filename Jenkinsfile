pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
    IMAGE_NAME = "faiza2003/webapp"
    IMAGE_TAG  = "${BUILD_NUMBER}"
    KUBECONFIG = "/var/lib/jenkins/.kube/config"
  }

  stages {

    stage('Code Fetch') {
      steps {
        echo 'Fetching code from GitHub...'
        git branch: 'main',
            url: 'https://github.com/Faiza-riaz20/my-web-app.git',
            credentialsId: 'github-creds'
        echo 'Code fetched successfully.'
      }
    }

    stage('Docker Image Creation') {
      steps {
        echo 'Building Docker image...'
        sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
        sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest"
        sh '''
          echo $DOCKERHUB_CREDENTIALS_PSW | \
          docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
        '''
        sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
        sh "docker push ${IMAGE_NAME}:latest"
        echo 'Docker image pushed successfully.'
      }
    }

    stage('Kubernetes Deployment') {
      steps {
        echo 'Deploying to Kubernetes...'
        sh "kubectl apply -f k8s/deployment.yaml"
        sh "kubectl apply -f k8s/service.yaml"
        sh "kubectl set image deployment/webapp-deployment webapp=${IMAGE_NAME}:${IMAGE_TAG}"
        sh "kubectl rollout status deployment/webapp-deployment"
        echo 'Kubernetes deployment successful.'
      }
    }

    stage('Prometheus/Grafana Setup') {
      steps {
        echo 'Applying Prometheus and Grafana manifests...'
        sh "kubectl apply -f k8s/prometheus-configmap.yaml"
        sh "kubectl apply -f k8s/prometheus-deployment.yaml"
        sh "kubectl apply -f k8s/grafana-deployment.yaml"
        sh "kubectl rollout status deployment/prometheus-deployment"
        sh "kubectl rollout status deployment/grafana-deployment"
        echo 'Monitoring stack deployed successfully.'
      }
    }
  }

  post {
    success { echo 'Pipeline completed successfully!' }
    failure { echo 'Pipeline failed. Check logs for details.' }
    always { sh 'docker logout' }
  }
}
