#/bin/bash
#upload files
#export AWS_ACCESS_KEY_ID=AKIAROKMUFSWQUC4MLXE
#export AWS_SECRET_ACCESS_KEY=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
aws s3 rm --recursive s3://test-events.isabel.sg
aws s3 cp ./dist s3://test-events.isabel.sg --recursive
aws cloudfront create-invalidation --distribution-id E19NUN4S4C96P8 --paths "/*"

