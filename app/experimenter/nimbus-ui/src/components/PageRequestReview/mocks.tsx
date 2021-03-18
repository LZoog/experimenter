/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import PageRequestReview from ".";
import { UPDATE_EXPERIMENT_MUTATION } from "../../gql/experiments";
import { MockConfigContext } from "../../hooks";
import { mockExperimentMutation, mockExperimentQuery } from "../../lib/mocks";
import { RouterSlugProvider } from "../../lib/test-utils";
import { NimbusExperimentStatus } from "../../types/globalTypes";

export const { mock, experiment } = mockExperimentQuery("demo-slug");

export function createMutationMock(
  id: number,
  status = NimbusExperimentStatus.REVIEW,
) {
  return mockExperimentMutation(
    UPDATE_EXPERIMENT_MUTATION,
    {
      id,
      status,
    },
    "updateExperiment",
    {
      experiment: {
        status,
      },
    },
  );
}

export const Subject = ({
  mocks = [mock, createMutationMock(experiment.id!)],
}: {
  mocks?: React.ComponentProps<typeof RouterSlugProvider>["mocks"];
}) => (
  <RouterSlugProvider {...{ mocks }}>
    <PageRequestReview polling={false} />
  </RouterSlugProvider>
);

export const SubjectEXP1060 = ({
  mocks = [mock],
  ...pageProps
}: {
  mocks?: React.ComponentProps<typeof RouterSlugProvider>["mocks"];
} & Partial<React.ComponentProps<typeof PageRequestReview>>) => (
  <MockConfigContext.Provider
    value={{ featureFlags: { exp1060Preview: true } }}
  >
    <RouterSlugProvider mocks={mocks}>
      <PageRequestReview
        {...{
          polling: false,
          ...pageProps,
        }}
      />
    </RouterSlugProvider>
  </MockConfigContext.Provider>
);
