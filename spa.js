// shared helper function
function bootstrap_inputs(fields, values = {}) {
  return Object.entries(fields)
    .map(
      ([key, cfg]) => `
		<div class="form-floating mb-3">
			<input
				type="${cfg.type || "text"}"
				class="form-control"
				id="${key}"
				name="${key}"
				value="${values[key] ?? ""}"
				placeholder=" "
				${cfg.pattern ? `pattern="${cfg.pattern}"` : ""}
				${cfg.required === false ? "" : "required"}
			>
			<label for="${key}">${cfg.label}</label>
		</div>
	`
    )
    .join("");
}

// toast notification continer
customElements.define(
  "toast-container",
  class extends HTMLElement {
    connectedCallback() {
      this.className = "toast-container position-fixed top-0 end-0 p-3";
      addEventListener("toast", (e) => this.show(e.detail));
    }
    show({ message, style = "text-bg-info" }) {
      const el = document.createElement("div");
      el.className = `toast ${style}`;
      el.innerHTML = `<div class="toast-body">${message}</div>`;
      this.append(el);
      new bootstrap.Toast(el, { delay: 3000 }).show();
      el.addEventListener("hidden.bs.toast", () => el.remove());
    }
  }
);
