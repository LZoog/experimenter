/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { render, screen } from "@testing-library/react";
import React from "react";
import FeedbackRejected from ".";

describe("FeedbackRejected", () => {
  it("renders as expected", () => {
    // TODO: replace FeedbackRejected props with real data from mockExperimentQuery
    // in EXP-1062 when EXP-1060 is final
    // const { experiment } = mockExperimentQuery("demo-slug").rejectFeedback;
    const reviewerEmail = "example@mozilla.com";
    const reviewDate = new Date().toISOString();
    const rejectReason = "It's bad. Just start over.";
    render(
      <FeedbackRejected {...{ reviewerEmail, reviewDate, rejectReason }} />,
    );
    expect(screen.getByTestId("feedback-rejected")).toBeInTheDocument();
    expect(screen.getByTestId("reject-reviewer")).toHaveTextContent(
      `${reviewerEmail} on ${reviewDate}`,
    );
    expect(screen.getByTestId("reject-reason")).toHaveTextContent(rejectReason);
  });
});
