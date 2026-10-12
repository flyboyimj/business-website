// CloudFront Function (viewer request) for the S3 + CloudFront hosting option.
// Maps clean URLs like /services/ or /services to /services/index.html.
// Not needed on AWS Amplify Hosting.
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  } else if (!uri.includes('.')) {
    request.uri += '/index.html';
  }
  return request;
}
