// base config
const contact_fields = {
  name: { label: "Name" },
  position: { label: "Position" },
  email: { label: "Email", type: "email" },
  invoiceEmail: { label: "Invoice Email", type: "email", required: false },
  telephone: {
    label: "Telephone",
    type: "tel",
    pattern: "^(0|\\+?44)7\\d{9}$|^(0|\\+?44)1\\d{8,9}$",
  },
};

const businessTypes = {
  limitedCompany: {
    name: "Limited Company",
    fields: {
      name: { label: "Company Name" },
      number: { label: "Company Number", pattern: "\\d{8}" },
      address: { label: "Address" },
    },
  },
  soleTrader: {
    name: "Sole Trader",
    fields: {
      name: { label: "Business Name" },
      address: { label: "Address" },
    },
  },
};

// pharma editor

customElements.define(
  "pharmacist-editor",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
			<div class="input-group mb-2">
				<input class="form-control gphc" placeholder="GPHC (7 digits)" maxlength="7">
				<input class="form-control name" placeholder="Full Name">
				<button class="btn btn-outline-danger" type="button">✕</button>
			</div>
		`;

      this.querySelector("button").onclick = () => this.remove();
    }

    get value() {
      return {
        gphc: this.querySelector(".gphc").value,
        name: this.querySelector(".name").value,
      };
    }

    isValid() {
      const { gphc, name } = this.value;
      return /^\d{7}$/.test(gphc) && name.trim().length > 0;
    }
  }
);

// main componet

customElements.define(
  "business-application",
  class extends HTMLElement {
    connectedCallback() {
      this.render();
      this.addEventListener("click", this);
      this.addEventListener("submit", this);
    }

    handleEvent(e) {
      if (e.target.name === "businessType") {
        this.renderBusinessFields(e.target.value);
      }

      if (e.target.id === "add-pharmacist") {
        this.querySelector("#pharmacists").append(
          document.createElement("pharmacist-editor")
        );
      }

      if (e.type === "submit") {
        e.preventDefault();
        this.submit();
      }
    }

    render() {
      this.innerHTML = `
			<form>
				<div class="mb-3">
					${Object.entries(businessTypes)
            .map(
              ([k, v]) => `
						<input type="radio" class="btn-check" name="businessType" value="${k}" id="${k}" required>
						<label class="btn btn-outline-primary me-2" for="${k}">${v.name}</label>
					`
            )
            .join("")}
				</div>

				<fieldset id="business"></fieldset>

				<fieldset>
					<legend>Contact</legend>
					${bootstrap_inputs(contact_fields)}
				</fieldset>

				<fieldset class="mt-4">
					<legend>Pharmacists</legend>
					<div id="pharmacists"></div>
					<button type="button" class="btn btn-sm btn-secondary mt-2" id="add-pharmacist">
						Add Pharmacist
					</button>
				</fieldset>

				<button type="submit" class="btn btn-primary mt-4">Submit</button>
			</form>
		`;
    }

    renderBusinessFields(type) {
      const fields = businessTypes[type].fields;
      this.querySelector("#business").innerHTML =
        `<legend>${businessTypes[type].name}</legend>` +
        bootstrap_inputs(fields);
    }

    submit() {
      const pharmacists = [...this.querySelectorAll("pharmacist-editor")];

      if (!pharmacists.length) {
        dispatchEvent(
          new CustomEvent("toast", {
            detail: {
              message: "At least one pharmacist is required",
              style: "text-bg-danger",
            },
          })
        );
        return;
      }

      if (!pharmacists.every((p) => p.isValid())) {
        dispatchEvent(
          new CustomEvent("toast", {
            detail: {
              message: "Invalid pharmacist details",
              style: "text-bg-danger",
            },
          })
        );
        return;
      }

      dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            message: "Application submitted successfully",
            style: "text-bg-success",
          },
        })
      );

      this.innerHTML = `<div class="alert alert-success">Thank you. We will contact you.</div>`;
    }
  }
);
