#!/bin/bash
rsync --rsync-path="sudo rsync" -r -avh --exclude={"deploy.sh"} /home/${USER}/projeler/quizApp ubuntu@ec2-18-193-123-70.eu-central-1.compute.amazonaws.com:/opt/projects/ --delete
ssh -i "nodejs-ubuntu.pem" ubuntu@ec2-18-193-123-70.eu-central-1.compute.amazonaws.com