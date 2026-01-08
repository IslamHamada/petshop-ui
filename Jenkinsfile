node {
  def repourl = "islamhamada/petshop"
  def version = sh(script: "date +%s", returnStdout: true).trim()
  stage('Checkout'){
    checkout([$class: "GitSCM",
      branches: [[name: '*/hetzner']],
      userRemoteConfigs: [[credentialsId: 'git',
      url: 'https://github.com/IslamHamada/petshop-ui.git']]])
  }
  stage('Build and Push Image'){
    nodejs(nodeJSInstallationName: 'NodeJS') {
        sh("npm cache clean --force")
        sh("npm ci")
        sh("npx ng build --configuration production")
    }
    sh("rm -rf node_modules")

    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub') {
      // Build the image (Dockerfile must be in root)
      def appImage = docker.build("${repourl}:frontend-${version}")
      appImage.push()
    }
  }
  stage("Deploy"){
    sh("sed -i 's|IMAGE_URL|${repourl}|g' k8s/deployment.yaml")
    sh("sed -i 's|TAG|${version}|g' k8s/deployment.yaml")
    withCredentials([file(credentialsId: 'k3s-kubeconfig', variable: 'KUBECONFIG_FILE')]) {
        sh "kubectl --kubeconfig=${KUBECONFIG_FILE} apply -f k8s/deployment.yaml"
        sh "kubectl --kubeconfig=${KUBECONFIG_FILE} apply -f k8s/cert.yaml || true"
    }
  }
}
