node {
  def repourl = "islamhamada/petshop"
  def version = sh(script: "date +%s", returnStdout: true).trim()
  stage('Checkout'){
    checkout([$class: "GitSCM",
      branches: [[name: '*/main']],
      userRemoteConfigs: [[credentialsId: 'git',
      url: 'https://github.com/IslamHamada/petshop-ui.git']]])
  }
  stage('Build and Push Image'){
    withCredentials([file(credentialsId: 'gcp', variable: 'GC_KEY')]) {
      sh("gcloud auth activate-service-account --key-file=${GC_KEY}")
      sh("gcloud auth configure-docker ${REGISTRY_URL}")
      nodejs(nodeJSInstallationName: 'NodeJS') {
        sh("npm cache clean --force")
        sh("npm ci")
        sh("npx ng build --configuration production")
      }
      sh("rm -rf node_modules")
      def dockerTask = docker.build("${repourl}/frontend:${version}")
      dockerTask.push()
    }
  }
  stage("Deploy"){
    sh("sed -i 's|IMAGE_URL|${repourl}|g' k8s/deployment.yaml")
    sh("sed -i 's|TAG|${version}|g' k8s/deployment.yaml")
    step([$class: 'KubernetesEngineBuilder',
          projectId: env.PROJECT_ID,
          clusterName: env.CLUSTER,
          location: env.ZONE,
          manifestPattern: 'k8s/deployment.yaml',
          credentialsId: env.PROJECT_ID,
          verifyDeployments: true])
    step([$class: 'KubernetesEngineBuilder',
          projectId: env.PROJECT_ID,
          clusterName: env.CLUSTER,
          location: env.ZONE,
          manifestPattern: 'k8s/cert.yaml',
          credentialsId: env.PROJECT_ID,
          verifyDeployments: true])
  }
}
