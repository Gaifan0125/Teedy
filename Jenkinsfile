') {
steps {
sh 'mvn pmd:pmd'
}
}
stage('JaCoCo') {
steps {
sh 'mvn jacoco:report'
}
}
stage('Javadoc') {
steps {
sh 'mvn javadoc:javadoc'
}
}
stage('Site') {
steps {
sh 'mvn site'
}
}
stage('Package') {
steps {
sh 'mvn package -DskipTests'
}
}
}
post {
always {
archiveArtifacts artifacts: '**/target/site/**/*.*', fingerprint: true
archiveArtifacts artifacts: '**/target/**/*.jar', fingerprint: true
archiveArtifacts artifacts: '**/target/**/*.war', fingerprint: true
junit '**/target/surefire-reports/*.xml'
}
}
}
