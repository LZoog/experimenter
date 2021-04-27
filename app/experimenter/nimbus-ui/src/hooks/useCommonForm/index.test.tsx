/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import React from "react";
import { overviewFieldNames } from "../../components/FormOverview";
import { Subject as OverviewSubject } from "../../components/FormOverview/mocks";
import { audienceFieldNames } from "../../components/PageEditAudience/FormAudience";
import { Subject as AudienceSubject } from "../../components/PageEditAudience/FormAudience/mocks";
import { branchFieldNames } from "../../components/PageEditBranches/FormBranches/FormBranch";
import {
  MOCK_FEATURE_CONFIG_WITH_SCHEMA,
  SubjectBranch as BranchSubject,
} from "../../components/PageEditBranches/FormBranches/mocks";
import { metricsFieldNames } from "../../components/PageEditMetrics/FormMetrics";
import { Subject as MetricsSubject } from "../../components/PageEditMetrics/FormMetrics/mocks";
import { mockExperimentQuery } from "../../lib/mocks";

describe("hooks/useCommonForm", () => {
  describe("works as expected", () => {
    const overviewSetup = () => {
      const submitErrors = {
        name: ["That name is terrible, man"],
        hypothesis: ["Big bad happened"],
      };
      render(<OverviewSubject {...{ submitErrors }} />);
      return { nameField: screen.getByLabelText("Public name"), submitErrors };
    };

    it("clears submit error onChange of input field with error", async () => {
      const { nameField, submitErrors } = overviewSetup();
      const nameError = screen.getByText(submitErrors["name"][0]);
      expect(nameField).toHaveClass("is-invalid");
      expect(nameError).toBeInTheDocument();

      await act(async () => {
        fireEvent.change(nameField, {
          target: { value: "abc" },
        });
        fireEvent.blur(nameField);
      });

      expect(nameField).toHaveClass("is-valid");
      expect(nameError).not.toBeInTheDocument();
    });

    it("clears only its own field submit error onChange of field with error", async () => {
      const { nameField, submitErrors } = overviewSetup();
      const getHypothesisError = () =>
        screen.queryByText(submitErrors["hypothesis"][0]);
      const hypothesisField = screen.getByLabelText("Hypothesis");
      expect(hypothesisField).toHaveClass("is-invalid");
      expect(getHypothesisError()).toBeInTheDocument();

      await act(async () => {
        fireEvent.change(nameField, {
          target: { value: "abc" },
        });
        fireEvent.blur(nameField);
      });
      expect(hypothesisField).toHaveClass("is-invalid");
      expect(getHypothesisError()).toBeInTheDocument();
    });

    it("clears submit error onChange of multiselect", async () => {
      const submitErrors = {
        primary_outcomes: ["Your primary outcomes stink."],
      };
      const { experiment } = mockExperimentQuery("boo", {
        primaryOutcomes: [],
      });
      const { container } = render(
        <MetricsSubject {...{ submitErrors, experiment }} />,
      );

      const primaryOutcomes = screen.getByTestId("primary-outcomes");
      const errorFeedback = screen.getByText(submitErrors.primary_outcomes[0]);
      expect(errorFeedback).toBeInTheDocument();
      expect(
        container.querySelector("[for='primaryOutcomes'] + div"),
      ).toHaveClass("is-invalid border border-danger rounded");

      fireEvent.keyDown(primaryOutcomes.children[1], { key: "ArrowDown" });
      fireEvent.click(screen.getByText("Picture-in-Picture"));
      expect(errorFeedback).not.toBeInTheDocument();
    });
  });

  describe("is used on expected fields", () => {
    // TODO EXP-780 - improve these tests by mocking `useCommonForm` to ensure `<FormErrors />`,
    // `formControlAttrs`, and `formSelectAttrs` are all called with the expected field names
    // and/or move these form tests into their corresponding form test files
    describe("FormOverview", () => {
      it("with experiment data", async () => {
        const { experiment } = mockExperimentQuery("boo");
        render(<OverviewSubject {...{ experiment }} />);

        for (const name of overviewFieldNames) {
          // TODO EXP-805 test errors form saving once
          // documentationLinks uses useCommonForm
          if (!["application", "documentationLinks"].includes(name)) {
            await screen.findByTestId(`${name}-form-errors`);
            await screen.findByTestId(name);
          }
        }
      });

      it("without experiment data", async () => {
        await act(async () => {
          render(<OverviewSubject />);
        });

        overviewFieldNames.forEach((name) => {
          if (
            ![
              "publicDescription",
              "documentationLinks",
              "riskMitigationLink",
            ].includes(name)
          ) {
            expect(
              screen.queryByTestId(`${name}-form-errors`),
            ).toBeInTheDocument();
            expect(screen.queryByTestId(name)).toBeInTheDocument();
          }
        });
      });
    });

    it("FormMetrics", () => {
      render(<MetricsSubject />);

      metricsFieldNames.forEach((name) => {
        expect(screen.queryByTestId(`${name}-form-errors`)).toBeInTheDocument();
        // TODO EXP-780
        // expect(screen.queryByTestId(name)).toBeInTheDocument();
      });
    });

    it("FormAudience", () => {
      render(<AudienceSubject />);

      audienceFieldNames.forEach((name) => {
        expect(screen.queryByTestId(`${name}-form-errors`)).toBeInTheDocument();
        expect(screen.queryByTestId(name)).toBeInTheDocument();
      });
    });

    it("FormBranch", () => {
      const { container } = render(
        <BranchSubject
          experimentFeatureConfig={MOCK_FEATURE_CONFIG_WITH_SCHEMA}
        />,
      );

      branchFieldNames.forEach((name) => {
        const fieldName = `referenceBranch.${name}`;
        // all branch field names call `formControlAttrs`
        expect(screen.queryByTestId(fieldName)).toBeInTheDocument();

        // featureValue must be "enabled" to show the submit error
        if (name === "featureValue") {
          (async () => {
            const field = container.querySelector(
              `[name="${fieldName}"]`,
            ) as HTMLInputElement;
            act(() => {
              fireEvent.focus(field!);
              fireEvent.change(field!, { target: { value: true } });
            });
            await waitFor(() => {
              expect(
                screen.queryByTestId(`${fieldName}-form-errors`),
              ).toBeInTheDocument();
            });
          })();
          // featureEnabled does not call FormErrors because it is a global error
        } else if (name !== "featureEnabled") {
          expect(
            screen.queryByTestId(`${fieldName}-form-errors`),
          ).toBeInTheDocument();
        }
      });
    });
  });
});