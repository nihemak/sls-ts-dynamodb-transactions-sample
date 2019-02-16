This is a sample of DynamoDB Transactions. In this sample it use Serverless Framework and Typescript.

# APIs

* `GET /init`: initializer of DynamoDB tables
* `GET /add`: insert of DynamoDB table using DynamoDB Transactions

# Tables

* `transaction-categories`: Manage the number of records that can be added to the transaction-items table
* `transaction-items`: table of items

# Setup Environment

Create Environment CloudFormation Stack.

```bash
aws cloudformation validate-template --template-body file://environment.cfn.yml
aws cloudformation create-stack --stack-name sls-ts-dynamodb-transactions-sample --template-body file://environment.cfn.yml --capabilities CAPABILITY_IAM
```

Copy GitHub to CodeCommit.

```bash
git clone --mirror https://github.com/nihemak/sls-ts-dynamodb-transactions-sample.git sls-ts-dynamodb-transactions-sample
cd sls-ts-dynamodb-transactions-sample
git push ssh://git-codecommit.ap-northeast-1.amazonaws.com/v1/repos/sls-ts-dynamodb-transactions-sample --all
cd ..
```

Create Serverless Environment.

```bash
CODEBUILD_ID=$(aws codebuild start-build --project-name sls-ts-dynamodb-transactions-sample --source-version master | tr -d "\n" | jq -r '.build.id')
echo "started.. id is ${CODEBUILD_ID}"
while true
do
  sleep 10s
  STATUS=$(aws codebuild batch-get-builds --ids "${CODEBUILD_ID}" | tr -d "\n" | jq -r '.builds[].buildStatus')
  echo "..status is ${STATUS}."
  if [ "${STATUS}" != "IN_PROGRESS" ]; then
    if [ "${STATUS}" != "SUCCEEDED" ]; then
      echo "faild."
    fi
    echo "done."
    break
  fi
done
```

# Test

Get RestApi id.

```bash
REST_API_ID=$(aws cloudformation describe-stack-resources --stack-name sls-ts-dynamodb-transactions-sample-test | jq -r '.StackResources[] | select(.ResourceType == "AWS::ApiGateway::RestApi") | .PhysicalResourceId')
```

Initialize the DynamoDB table.

```bash
curl -X GET https://${REST_API_ID}.execute-api.ap-northeast-1.amazonaws.com/test/init
```

Add item. This will succeed.

```bash
curl -X GET https://${REST_API_ID}.execute-api.ap-northeast-1.amazonaws.com/test/add
```

Add item. This will fail. Because the number of records that can be added to the transaction-items table is 1.

```bash
curl -X GET https://${REST_API_ID}.execute-api.ap-northeast-1.amazonaws.com/test/add
```
