package com.couplecalendar.domain.aggregate

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import java.time.LocalDate

class UserTest {

    private fun newUser(): User = User.create(
        email = "alice@example.com",
        nickname = "alice"
    )

    @Test
    fun `create defaults name to nickname when name not provided`() {
        val user = User.create(email = "bob@example.com", nickname = "bob")

        assertEquals("bob", user.name)
        assertEquals("bob", user.nickname)
    }

    @Test
    fun `create uses provided name when given`() {
        val user = User.create(email = "bob@example.com", nickname = "bob", name = "Bob Kim")

        assertEquals("Bob Kim", user.name)
        assertEquals("bob", user.nickname)
    }

    @Test
    fun `updateProfile updates name when provided`() {
        val user = newUser()

        user.updateProfile(name = "New Name")

        assertEquals("New Name", user.name)
    }

    @Test
    fun `updateProfile rejects blank name`() {
        val user = newUser()

        val ex = assertThrows(IllegalArgumentException::class.java) {
            user.updateProfile(name = "  ")
        }
        assertEquals("Name cannot be blank", ex.message)
    }

    @Test
    fun `updateProfile rejects blank nickname`() {
        val user = newUser()

        val ex = assertThrows(IllegalArgumentException::class.java) {
            user.updateProfile(nickname = "")
        }
        assertEquals("Nickname cannot be blank", ex.message)
    }

    @Test
    fun `updateProfile leaves nickname unchanged when not provided`() {
        val user = newUser()

        user.updateProfile(name = "Only Name")

        assertEquals("alice", user.nickname)
    }

    @Test
    fun `updateProfile sets birthday when present with value`() {
        val user = newUser()
        val bday = LocalDate.of(1990, 5, 20)

        user.updateProfile(birthday = bday, birthdayPresent = true)

        assertEquals(bday, user.birthday)
    }

    @Test
    fun `updateProfile rejects future birthday`() {
        val user = newUser()
        val future = LocalDate.now().plusDays(1)

        val ex = assertThrows(IllegalArgumentException::class.java) {
            user.updateProfile(birthday = future, birthdayPresent = true)
        }
        assertEquals("Birthday cannot be in the future", ex.message)
    }

    @Test
    fun `updateProfile clears birthday when present with null`() {
        val user = User.create(
            email = "alice@example.com",
            nickname = "alice",
            birthday = LocalDate.of(1990, 1, 1)
        )

        user.updateProfile(birthday = null, birthdayPresent = true)

        assertNull(user.birthday)
    }

    @Test
    fun `updateProfile does not touch birthday when not present`() {
        val existing = LocalDate.of(1990, 1, 1)
        val user = User.create(
            email = "alice@example.com",
            nickname = "alice",
            birthday = existing
        )

        user.updateProfile(name = "X", birthday = null, birthdayPresent = false)

        assertEquals(existing, user.birthday)
    }

    @Test
    fun `updateProfile sets and clears bio based on presence`() {
        val user = newUser()

        user.updateProfile(bio = "hello", bioPresent = true)
        assertEquals("hello", user.bio)

        user.updateProfile(bio = null, bioPresent = true)
        assertNull(user.bio)
    }

    @Test
    fun `updateProfile does not touch bio when not present`() {
        val user = newUser()
        user.updateProfile(bio = "keep", bioPresent = true)

        user.updateProfile(name = "X", bio = null, bioPresent = false)

        assertEquals("keep", user.bio)
    }

    @Test
    fun `updateProfile sets and clears partnerNickname based on presence`() {
        val user = newUser()

        user.updateProfile(partnerNickname = "honey", partnerNicknamePresent = true)
        assertEquals("honey", user.partnerNickname)

        user.updateProfile(partnerNickname = null, partnerNicknamePresent = true)
        assertNull(user.partnerNickname)
    }
}
