import * as cdk from 'aws-cdk-lib';
import * as path from 'path';
import { Construct } from 'constructs';
import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import { Runtime } from 'aws-cdk-lib/aws-lambda';// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { BundlingFileAccess } from 'aws-cdk-lib';

export class CdkBugBashStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const entry = path.join(__dirname, 'python-lambda');
    new PythonFunction(this, 'MyFunction', {
      entry: entry, // required
      runtime: Runtime.PYTHON_3_8, // required
      index: 'index.py', // optional, defaults to 'index.py'
      handler: 'handler', // optional, defaults to 'handler'
      bundling: {
        assetExcludes: ['.ignorefile'],
      }
    });

    const e = path.join(__dirname, 'python-lambda-custom')
    new PythonFunction(this, 'CustomBuild', {
      entry: e, // required
      runtime: Runtime.PYTHON_3_8, // required
      index: 'index.py', // optional, defaults to 'index.py'
      handler: 'handler', // optional, defaults to 'handler'
      bundling: {
        image: cdk.DockerImage.fromBuild(path.join(e)),
        bundlingFileAccess: BundlingFileAccess.VOLUME_COPY,
        assetExcludes: ['.ignorefile'],
        network: 'host'
      }
    }); 
  }
}
