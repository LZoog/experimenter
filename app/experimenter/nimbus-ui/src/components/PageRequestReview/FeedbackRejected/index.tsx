/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import { Alert } from "react-bootstrap";

type FeedbackRejectedProps = {
  reviewerEmail: string;
  reviewDate: string;
  rejectReason: string;
};

const FeedbackRejected = ({
  reviewerEmail,
  reviewDate,
  rejectReason,
}: FeedbackRejectedProps) => {
  return (
    <Alert variant="warning" data-testid="feedback-rejected">
      <div className="text-body">
        <p>
          Your experiment was <strong>Rejected</strong> due to:
        </p>
        <p className="mb-0" data-testid="reject-reviewer">
          {reviewerEmail} on {reviewDate}:
        </p>
        <p className="bg-white rounded border p-3" data-testid="reject-reason">
          {rejectReason}
        </p>
      </div>
    </Alert>
  );
};

export default FeedbackRejected;
