package com.variedadesjm.repository;

import com.variedadesjm.model.entity.UserIdentity;
import com.variedadesjm.model.enums.IdentityProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserIdentityRepository extends JpaRepository<UserIdentity, Long> {

    Optional<UserIdentity> findByProviderAndProviderUserId(IdentityProvider provider, String providerUserId);

    Optional<UserIdentity> findByUser_IdAndProvider(Long userId, IdentityProvider provider);

    boolean existsByUser_IdAndProvider(Long userId, IdentityProvider provider);
}