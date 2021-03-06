/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import { storiesOf } from "@storybook/react";
import { RouterSlugProvider } from "../../lib/test-utils";
import { withLinks } from "@storybook/addon-links";
import AppLayoutWithExperiment from ".";
import { mockExperimentQuery } from "../../lib/mocks";

const { mock } = mockExperimentQuery("demo-slug");

storiesOf("components/AppLayoutWithExperiment", module)
  .addDecorator(withLinks)
  .add("default, with sidebar", () => (
    <RouterSlugProvider mocks={[mock]}>
      <AppLayoutWithExperiment title="Howdy!" testId="AppLayoutWithExperiment">
        {({ experiment }) => <p>{experiment.name}</p>}
      </AppLayoutWithExperiment>
    </RouterSlugProvider>
  ))
  .add("without sidebar", () => (
    <RouterSlugProvider mocks={[mock]}>
      <AppLayoutWithExperiment
        title="Howdy!"
        testId="AppLayoutWithExperiment"
        sidebar={false}
      >
        {({ experiment }) => <p>{experiment.name}</p>}
      </AppLayoutWithExperiment>
    </RouterSlugProvider>
  ));
