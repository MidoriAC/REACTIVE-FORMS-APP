import { JsonPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-dinamic-page',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <h2>Reactivos: Dinámicos</h2>
    <hr />

    <form [formGroup]="myForm()" (ngSubmit)="onSubmit()" autocomplete="of">
      <!-- Nombre -->
      <div class="mb-3 row">
        <label class="col-sm-3 col-form-label">Nombre</label>
        <div class="col-sm-9">
          <input
            class="form-control"
            formControlName="name"
            placeholder="Nombre de la persona"
          />
          @if(isValidField('name')){
          <span class="form-text text-danger">{{ getFieldError('name') }}</span>
          }
        </div>
      </div>

      <!-- Agregar favorito -->
      <div class="mb-3 row">
        <label class="col-sm-3 col-form-label">Agregar</label>
        <div class="col-sm-9" formArrayName="favoriteGames">
          <div class="input-group">
            <input
              class="form-control"
              [formControl]="newFavorite()"
              placeholder="Agregar Favorito"
            />
            <Button
              (click)="onAddFavorites()"
              class="btn btn-outline-primary"
              type="button"
              >Agregar Favorito</Button
            >
          </div>
        </div>
      </div>

      <!-- Lista de juegos Favoritos  -->
      <div class="mb-3 row">
        <label class="col-sm-3 col-form-label">Favoritos</label>
        <div class="col-sm-9" formArrayName="favoriteGames">
          @for (favorite of favoriteGames.controls; track favorite; let idx =
          $index) {
          <div class="mb-1">
            <div class="input-group">
              <input [formControlName]="idx" class="form-control" />
              <Button
                (click)="onDeleteFavorite(idx)"
                class="btn btn-outline-danger"
                type="button"
                >Eliminar</Button
              >
              @if(isValidFieldInArray(favoriteGames, idx)){
              <span class="form-text text-danger">Este campo es requerido</span>
              }
            </div>
          </div>
          }
        </div>
      </div>

      <div class="row">
        <div class="col-sm-12">
          <button type="submit" class="btn btn-primary float-end">
            Guardar
          </button>
        </div>
      </div>
    </form>

    <span>Valid</span>
    <pre>{{ myForm().valid | json }}</pre>
    <span>Value</span>
    <pre>{{ myForm().value | json }}</pre>
    <span>Agregar juegos</span>
    <pre>{{ newFavorite().value | json }}</pre>
    <pre>{{ newFavorite().value | json }}</pre>
  `,
  styles: ``,
})
export class DinamicPageComponent {
  #fb = inject(FormBuilder);

  public myForm = signal<FormGroup>(
    this.#fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      favoriteGames: this.#fb.array([
        ['World of Warcraft', Validators.required],
        ['League of Legends', Validators.required],
      ]),
    })
  );

  public newFavorite = signal<FormControl<string | null>>(
    new FormControl('', Validators.required)
  );

  get favoriteGames() {
    return this.myForm().controls['favoriteGames'] as FormArray;
  }
  isValidField(field: string): boolean | null {
    return (
      this.myForm().controls[field].errors &&
      this.myForm().controls[field].touched
    );
  }

  isValidFieldInArray(formArray: FormArray, index: number) {
    return (
      formArray.controls[index].errors && formArray.controls[index].touched
    );
  }

  getFieldError(field: string): string | null {
    if (!this.myForm().controls[field]) return null;

    const errors = this.myForm().controls[field].errors || {};

    console.log(errors);
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'El campo es Obligatorii';
        case 'minlength':
          return `El campo debe terne al menos ${errors[key].requiredLength} caracteres `;
        case 'min':
          return `El campo debe ser  mayor o igual que ${errors[key].min} `;
      }
    }
    return 'j';
  }

  onAddFavorites(): void {
    if (this.newFavorite().invalid) return;
    const newGame = computed(() => this.newFavorite().value);
    // this.favoriteGames.push(new FormControl(newGame(), Validators.required));
    this.favoriteGames.push(this.#fb.control(newGame(), Validators.required));
    this.newFavorite().reset();

    console.log(this.newFavorite().value);
  }

  onDeleteFavorite(index: number): void {
    this.favoriteGames.removeAt(index);
  }

  onSubmit(): void {
    if (this.myForm().invalid) {
      this.myForm().markAllAsTouched();
      return;
    }

    console.log(this.myForm().value);

    (this.myForm().controls['favoriteGames'] as FormArray) = this.#fb.array([]);

    this.myForm().reset();
  }
}
