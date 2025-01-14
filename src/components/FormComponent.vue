<template>
    <div class="form-container">
      <h2>Регистрация</h2>
      <form @submit.prevent="handleSubmit" class="form">
        <!-- Имя пользователя -->
        <div class="form-group">
          <label for="username">Имя пользователя:</label>
          <input
            id="username"
            type="text"
            v-model="formState.username.value"
            @input="validateOnChange('username')"
            class="form-input"
            :class="{ 'input-error': formState.username.errors.length }"
          />
          <p v-if="formState.username.errors.length" class="error-message">
            {{ formState.username.errors[0] }}
          </p>
        </div>
  
        <!-- Email -->
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            id="email"
            type="email"
            v-model="formState.email.value"
            @input="validateOnChange('email')"
            class="form-input"
            :class="{ 'input-error': formState.email.errors.length }"
          />
          <p v-if="formState.email.errors.length" class="error-message">
            {{ formState.email.errors[0] }}
          </p>
        </div>
  
        <!-- Дата рождения -->
        <div class="form-group">
          <label for="birthDate">Дата рождения:</label>
          <input
            id="birthDate"
            type="date"
            v-model="formState.birthDate.value"
            @input="validateOnChange('birthDate')"
            class="form-input"
            :class="{ 'input-error': formState.birthDate.errors.length }"
          />
          <p v-if="formState.birthDate.errors.length" class="error-message">
            {{ formState.birthDate.errors[0] }}
          </p>
        </div>
  
        <!-- Страна проживания -->
        <div class="form-group">
          <label for="country">Страна проживания:</label>
          <select
            id="country"
            v-model="formState.country.value"
            @change="validateOnChange('country'); updateCities()"
            class="form-input"
          >
            <option value="">Выберите страну</option>
            <option v-for="country in countries" :key="country" :value="country">
              {{ country }}
            </option>
          </select>
          <p v-if="formState.country.errors.length" class="error-message">
            {{ formState.country.errors[0] }}
          </p>
        </div>
  
        <!-- Город -->
        <div class="form-group" v-if="formState.country.value">
          <label for="city">Город:</label>
          <select
            id="city"
            v-model="formState.city.value"
            @change="validateOnChange('city')"
            class="form-input"
          >
            <option value="">Выберите город</option>
            <option v-for="city in availableCities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
          <p v-if="formState.city.errors.length" class="error-message">
            {{ formState.city.errors[0] }}
          </p>
        </div>
  
        <button type="submit" :disabled="!isFormValid" class="form-button">
          Отправить
        </button>
      </form>
  
      <p v-if="formSubmitted" class="success-message">Форма успешно отправлена!</p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed } from "vue";
  import { useFormValidator } from "../composables/useFormValidator";
  import "../styles/FormComponent.css"; 
  export default defineComponent({
    setup() {
      const formSubmitted = ref(false);
  
      const countries = ["Россия", "США", "Германия", "Франция"];
      const cityMap = {
        Россия: ["Москва", "Санкт-Петербург", "Новосибирск"],
        США: ["Нью-Йорк", "Лос-Анджелес", "Чикаго"],
        Германия: ["Берлин", "Мюнхен", "Гамбург"],
        Франция: ["Париж", "Лион", "Марсель"],
      };
  
      const { formState, validateForm, isFormValid, validateOnChange } =
        useFormValidator({
          username: {
            value: "",
            rules: [
              (value) => (!value ? "Имя пользователя обязательно" : null),
              (value) =>
                value.length < 3
                  ? "Имя пользователя должно быть больше 3 символов"
                  : null,
            ],
          },
          email: {
            value: "",
            rules: [
              (value) => (!value ? "Email обязателен" : null),
              (value) =>
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Неверный email" : null,
            ],
          },
          birthDate: {
            value: "",
            rules: [(value) => (!value ? "Дата рождения обязательна" : null)],
          },
          country: {
            value: "",
            rules: [(value) => (!value ? "Выберите страну" : null)],
          },
          city: {
            value: "",
            rules: [(value) => (!value ? "Выберите город" : null)],
          },
        });
  
      const availableCities = computed(() =>
        cityMap[formState.country.value] || []
      );
  
      const handleSubmit = () => {
        validateForm();
        if (isFormValid.value) {
          formSubmitted.value = true;
        }
      };
  
      const updateCities = () => {
        formState.city.value = ""; // Сбрасываем выбранный город при смене страны
      };
  
      return {
        formState,
        validateForm,
        isFormValid,
        validateOnChange,
        formSubmitted,
        handleSubmit,
        countries,
        availableCities,
        updateCities,
      };
    },
  });
  </script>    