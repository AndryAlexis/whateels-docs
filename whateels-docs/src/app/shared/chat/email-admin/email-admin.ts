import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { WhateelbotService } from '../../services/whateelbot.service';
import { EmailAdminService } from '../../services/email-admin.service';

@Component({
  selector: 'app-email-admin',
  imports: [ReactiveFormsModule],
  templateUrl: './email-admin.html',
  styleUrl: './email-admin.css',
})
export class EmailAdmin {
  private readonly formBuilder = inject(FormBuilder);
  private readonly whateelbotService = inject(WhateelbotService);
  private readonly emailAdminService = inject(EmailAdminService);

  openWhateelbot(): void {
    this.emailAdminService.close();
    this.whateelbotService.open();
  }

  readonly emailForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Za-zÀ-ÿ' -]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
  });

  sendEmail(event: SubmitEvent): void {
    event.preventDefault();

    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    console.log(JSON.stringify(this.emailForm.getRawValue(), null, 2));
  }
}
